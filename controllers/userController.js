import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        res.status(400);
        res.render("join", { pageTitle: "Join" })
    } else {
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password)
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Log In" });
export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

// Naver Login
export const naverLogin = passport.authenticate("naver");

export const naverLoginCallback = async (_, __, profile, done) => {
    const {
        _json: { id, email, nickname, profile_image }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.naverId = id;
            user.save();
            return done(null, user);
        }
        const newUser = await User.create({
            naverId: id,
            email,
            name: nickname,
            avatarUrl: profile_image
        });
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}

export const postNaverLogin = (req, res) => {
    res.redirect(routes.home);
}

// Kakao Login
export const kakaoLogin = passport.authenticate("kakao");

export const kakaoLoginCallback = async (_, __, profileA, done) => {
    const {
        _json: { id, properties: { nickname }, kakao_account: { profile, email }, }
    } = profileA;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.kakaoId = id;
            user.save();
            return done(null, user);
        }
        const newUser = await User.create({
            kakaoId: id,
            email,
            name: nickname,
            avatarUrl: profile.thumbnail_image_url
        });
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}

export const postKakaoLogin = (req, res) => {
    res.redirect(routes.home)
}

// Logout
export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("getMe", { pageTitle: "User Detail", user });
}

export const userDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
}

export const getEditProfile = (req, res) => res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.path : req.user.avatarUrl
        });
        res.redirect(routes.me)
    } catch (error) {
        res.redirect(routes.editProfile);
    }
}

export const getChangePassword = (req, res) => res.render("changePassword", { pageTitle: "Change Password" });
export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    try {
        if (newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
}