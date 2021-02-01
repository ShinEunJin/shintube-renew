import express from "express";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import { getJoin, getLogin, getMe, kakaoLogin, logout, naverLogin, postJoin, postKakaoLogin, postLogin, postNaverLogin } from "../controllers/userController";
import { onlyPrivate, onlyPublic } from "../middlewares";
import passport from "passport";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);


globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

// Naver
globalRouter.get(routes.naver, naverLogin);
globalRouter.get(
    routes.naverCallback,
    passport.authenticate("naver", { failureRedirect: "/login" }),
    postNaverLogin
);

// Kakao
globalRouter.get(routes.kakao, kakaoLogin)
globalRouter.get(
    routes.kakaoCallback,
    passport.authenticate("kakao", { failureRedirect: "/login" }),
    postKakaoLogin
)

globalRouter.get(routes.me, onlyPrivate, getMe);

export default globalRouter;