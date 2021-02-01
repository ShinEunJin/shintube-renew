import passport from "passport";
import NaverStrategy from "passport-naver";
import KakaoStrategy from "passport-kakao";
import User from "./models/User";
import { kakaoLoginCallback, naverLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(new NaverStrategy({
    clientID: process.env.NAVER_ID,
    clientSecret: process.env.NAVER_SECRET,
    callbackURL: `http://localhost:4000${routes.naverCallback}`
}, naverLoginCallback));

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: `http://localhost:4000${routes.kakaoCallback}`
}, kakaoLoginCallback));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());