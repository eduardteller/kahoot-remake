import { WebSocketServer, WebSocket } from "ws";
import express, { NextFunction } from "express";
import http from "http";
import * as querystring from "querystring";
import cors from "cors";
import { Request, Response } from "express";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

type Question = {
  answer: string;
  correct: boolean;
};

class QuestionSet {
  question: string;
  answers: Question[];

  constructor(question: string, ...answers: Question[]) {
    if (answers.length !== 4) {
      throw new Error("QuestionSet requires exactly four questions.");
    }
    this.question = question;
    this.answers = answers;
  }
}

export type Client = {
  ws: WebSocket;
  name: string;
  answer: number;
  xp: number;
  avatar: string;
};

export class Session {
  id: number;
  host: WebSocket | null;
  clients: Client[];
  questions: QuestionSet[];

  constructor(
    host: WebSocket | null,
    id: number,
    clients: Client[],
    play: QuestionSet[],
  ) {
    this.id = id;
    this.host = host;
    this.clients = clients;
    this.questions = play;
  }
}

let connections: Session[] = [];

const usedIdsArr: number[] = [];

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.set("trust proxy", 1);
app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, "../dist")));

wss.on("connection", async (ws, request: WebSocket) => {
  const queryString = request.url.split("?")[1];
  if (queryString) {
    const query = querystring.parse(queryString);

    const clientId = Array.isArray(query.clientId)
      ? query.clientId[0]
      : query.clientId || "Unknown";

    const connectIdRaw = Array.isArray(query.connectId)
      ? query.connectId[0]
      : query.connectId;

    const currentAvatar = Array.isArray(query.avatar)
      ? query.avatar[0]
      : query.avatar;

    const conn = connectIdRaw ? parseInt(connectIdRaw) : null;

    const searchedConnection = connections.find((value) => value.id === conn);

    searchedConnection?.clients.push({
      name: clientId,
      ws: ws,
      answer: -1,
      xp: 0,
      avatar: currentAvatar ?? "",
    });

    if (searchedConnection && searchedConnection.host) {
      searchedConnection.host.send(
        JSON.stringify({
          type: "client_data",
          clients: searchedConnection.clients,
        }),
      );
    }
  }

  ws.on("message", async (message: string) => {
    const msg = await JSON.parse(message);

    if (msg.type === "host") {
      const currentSession = connections.find((value) => value.id === msg.id);
      if (currentSession) currentSession.host = ws;
      console.log("new host", msg.id);
    }
  });

  ws.on("close", () => {
    connections = connections.filter((item) => {
      item.clients = item.clients.filter((client) => client.ws !== ws);
      const res: boolean = item.host !== ws ? true : false;
      return res;
    });

    /* TODO */
    //Goes through all the sessions and sends new client data, should only update the modified session clients
    for (const sessions of connections) {
      if (sessions.host) {
        sessions.host.send(
          JSON.stringify({ type: "client_data", clients: sessions.clients }),
        );
      }
    }
  });
});

const getRandomInt = (min: number, max: number): number => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

const checkForExistance = (id: number) => {
  const result = usedIdsArr.every((i) => i !== id);
  return result;
};

app.post("/api/send-question-data", (req, res) => {
  try {
    const { data } = req.body;

    let identificator = getRandomInt(10000, 50000);
    while (!checkForExistance(identificator)) {
      identificator = getRandomInt(10000, 50000);
    }
    usedIdsArr.push(identificator);
    const sess = new Session(null, identificator, [], data);
    connections.push(sess);
    res.status(200).json({ id: identificator });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
app.post("/api/client-answer", (req, res) => {
  try {
    const { connection, name, answer } = req.body;
    const searchedConnection = connections.find(
      (value) => value.id === connection,
    );
    const findClient = searchedConnection?.clients.find((p) => p.name === name);
    if (findClient) findClient.answer = answer;
    res.status(200).send();
  } catch (err) {
    console.error(err);
  }
});
app.post("/api/start-game", (req, res) => {
  try {
    const { id } = req.body;
    const currentSession = connections.find((value) => value.id === id);
    if (currentSession && currentSession.host) {
      for (const client of currentSession.clients) {
        client.ws.send(JSON.stringify({ type: "set" }));
      }
      res.status(200).json({ data: currentSession.questions });
    }
    console.log("OK START");
  } catch (err) {
    console.error(err);
  }
});
app.post("/api/end-game", (req, res) => {
  try {
    const { id } = req.body;
    const currentSession = connections.find((value) => value.id === id);
    if (currentSession && currentSession.host) {
      for (const client of currentSession.clients) {
        const sortedData: Client[] = currentSession.clients.sort(
          (a, b) => a.xp - b.xp,
        );
        sortedData.reverse();
        client.ws.send(
          JSON.stringify({
            type: "end",
            place: sortedData.indexOf(client) + 1,
          }),
        );
      }
      res.status(200).send();
    }
    console.log("OK END");
  } catch (err) {
    console.error(err);
  }
});
app.post("/api/reveal-answers", (req, res) => {
  try {
    const { id, index } = req.body;
    const currentSession = connections.find((value) => value.id === id);
    if (currentSession && currentSession.host) {
      for (const cl of currentSession.clients) {
        if (cl.answer < 0) {
          cl.ws.send(
            JSON.stringify({
              type: "reveal",
              status: false,
            }),
          );
          continue;
        }

        if (currentSession?.questions[index].answers[cl.answer].correct) {
          cl.xp = cl.xp + 100;
        }

        cl.ws.send(
          JSON.stringify({
            type: "reveal",
            status: currentSession?.questions[index].answers[cl.answer].correct,
          }),
        );
      }
      res.status(200).send();
    }
    console.log("REVEAL OK");
  } catch (err) {
    console.error(err);
  }
});
app.post("/api/scoreboard-data", (req, res) => {
  try {
    const { id } = req.body;
    const currentSession = connections.find((value) => value.id === id);
    if (currentSession && currentSession.host) {
      res.status(200).json({ data: currentSession.clients });
    }
    console.log("SCORE SENT");
  } catch (err) {
    console.error(err);
  }
});

const uri = <string>(
  "mongodb+srv://edtell:N7NAvvKdajSNP6DI@kahoot-clone.e2vz7j4.mongodb.net/?retryWrites=true&w=majority&appName=kahoot-clone"
);

// // Load environment variables
dotenv.config();

const retrieveUserFromMongo = async (
  passedObj: string,
  discordNick: string,
  Davatar: string,
) => {
  const client = new MongoClient(uri);
  let user: DbUser | null = null;
  const database = client.db("kahoot-clone");
  const users = database.collection("users");
  // Query for a movie that has the title 'Back to the Future'
  user = (await users.findOne({ discordID: passedObj })) as DbUser;
  if (!user) {
    await users.insertOne({
      nickname: discordNick,
      avatar: Davatar,
      discordID: passedObj,
      refreshTokenVersion: 0,
    });
    user = (await users.findOne({ discordID: passedObj })) as DbUser;
  }
  await client.close();
  return user;
};

// Configure Passport with the Discord strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET_ID!,
      callbackURL: process.env.DISCORD_CALLBACK_URL!,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Save user information to your database here
      const discordId = profile.id;

      const discordNick = profile.username;
      const Davatar = profile.avatar;
      const newUrl =
        "https://cdn.discordapp.com/avatars/" + discordId + "/" + Davatar;

      const user = await retrieveUserFromMongo(discordId, discordNick, newUrl);

      return done(null, user);
    },
  ),
);

// Serialize and deserialize user information for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj as Express.User);
});

// Initialize express application

app.use(cookieParser());

// Initialize Passport and use session
app.use(passport.initialize());

app.get("/api/get-quiz/:id", async (req: Request, res: Response) => {
  const quizId = req.params.id as string;
  const client = new MongoClient(uri);
  const database = client.db("kahoot-clone");
  const quizes = database.collection("quizes");
  const rec = quizes.find({
    discordId: quizId,
  });
  const nameArray: string[] = [];
  for await (const doc of rec) {
    nameArray.push(doc.name as string);
  }
  await client.close();
  res.json({ names: nameArray });
});

app.get("/api/get-quiz-main/:id", async (req: Request, res: Response) => {
  const quizId = req.params.id as string;
  const client = new MongoClient(uri);
  const database = client.db("kahoot-clone");
  const quizes = database.collection("quizes");
  const rec = await quizes.findOne({
    name: quizId,
  });
  await client.close();
  res.json({ data: rec });
});

app.get("/api/del-quiz-main/:id", async (req: Request, res: Response) => {
  const quizId = req.params.id as string;
  const client = new MongoClient(uri);
  const database = client.db("kahoot-clone");
  const quizes = database.collection("quizes");
  await quizes.deleteOne({
    name: quizId,
  });
  await client.close();
  res.send();
});

app.post("/api/save-quiz", async (req: Request, res: Response) => {
  const received = req.body;
  const client = new MongoClient(uri);
  const database = client.db("kahoot-clone");
  const quizes = database.collection("quizes");
  let responesFromMongo = false;
  if (received) {
    const id = received.discordId as number;
    const data = received.data as QuestionSet[];
    const name = received.name as string;
    const rec = await quizes.insertOne({
      dataArray: data,
      discordId: id,
      name: name,
    });
    responesFromMongo = rec.acknowledged;
  }
  await client.close();

  if (responesFromMongo) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
});

app.get("/auth/discord", (req: Request, res: Response, next: NextFunction) => {
  const redirectUri = req.query.redirect_uri || req.headers.referer || "/";
  passport.authenticate("discord", {
    session: false,
    state: JSON.stringify({ redirect_uri: redirectUri }),
  })(req, res, next);
});

app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", {
    session: false,
    failureRedirect: "/",
  }),
  (req: Request, res: Response) => {
    const state = JSON.parse(req.query.state as string);
    const redirectUri = state.redirect_uri || "/";
    sendAuthCookies(res, req.user as DbUser);
    res.redirect(redirectUri);
  },
);

app.get("/validate", async (req: Request, res: Response) => {
  const { userId, user, userData } = await checkTokens(
    req.cookies.id,
    req.cookies.rid,
  );

  if (!userId) {
    console.log("Invalid token");
    res.json({ message: "error" });
  } else {
    if (user) {
      console.log("Old Access token", user.nickname);
      sendAuthCookies(res, user);
      res.json({ message: "ok", userData: user });
    } else {
      res.json({ message: "ok", userData: userData });
    }
  }
});

app.get("/clear", async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.redirect(req.headers.referer as string);
});

export type RefreshTokenData = {
  userId: string;
  refreshTokenVersion?: number;
};

export type AccessTokenData = {
  userId: string;
};

type DbUser = {
  _id: ObjectId;
  nickname: string;
  avatar: string;
  discordID: string;
  refreshTokenVersion: number;
};

const createAuthTokens = (
  user: DbUser,
): { refreshToken: string; accessToken: string } => {
  const refreshToken = jwt.sign(
    { userId: user.discordID, refreshTokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    },
  );

  const accessToken = jwt.sign(
    { userId: user.discordID },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15min",
    },
  );

  return { refreshToken, accessToken };
};

const cookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
} as const;

const sendAuthCookies = (res: Response, user: DbUser) => {
  const { accessToken, refreshToken } = createAuthTokens(user);
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("id", cookieOpts);
  res.clearCookie("rid", cookieOpts);
};

const checkTokens = async (accessToken: string, refreshToken: string) => {
  try {
    // verify
    const data = <AccessTokenData>(
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    );

    const client = new MongoClient(uri);

    const database = client.db("kahoot-clone");
    const users = database.collection("users");
    const user = (await users.findOne({ discordID: data.userId })) as DbUser;

    await client.close();

    return {
      userId: data.userId,
      userData: user,
    };
  } catch {
    //123
  }

  // 1. verify refresh token
  let data;
  try {
    data = <RefreshTokenData>(
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    );
  } catch {
    return {};
  }

  // 2. get user
  const client = new MongoClient(uri);

  const database = client.db("kahoot-clone");
  const users = database.collection("users");
  const user = (await users.findOne({ discordID: data.userId })) as DbUser;

  await client.close();

  // 3.check refresh token version
  if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
    return {};
  }

  return {
    userId: data.userId,
    user,
  };
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.listen(5090, async () => {
  console.log(`Kahoot backend is running on http://localhost:5090`);
});
