import { options } from "@/config";
import { Employee } from "@/models";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";

export default passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const employee = await Employee.findByPk(jwtPayload.id);

      if (!employee) {
        return done(null, false, {
          message: "თანამშრომელი ვერ მოიძებნა",
        });
      }

      return done(null, employee);
    } catch (error) {
      return done(error);
    }
  })
);
