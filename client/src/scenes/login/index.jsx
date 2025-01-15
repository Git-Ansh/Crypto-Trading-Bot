// src/scenes/login/Login.jsx
import React, { useState } from "react";
//import AppRouter from '../../Router';
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../utils/axiosInstance";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import AnimateButton from "../../components/AnimateButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Google from "../../assets/images/social-google.svg";

const Login = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const googleHandler = async () => {
    console.error("Login with Google");
    // Implement Google authentication logic here
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  var address = "https://crypto-trading-bot-sa5d.onrender.com/api/auth/login";
  if (process.env.NODE_ENV === "development") {
    address = "http://localhost:5000/api/auth/login";
  }
  console.log("address", address);
  // Ensure essential environment variables are set
  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="Large"
              variant="outlined"
              sx={{
                color: "#ffffff",
                backgroundColor: "#000000",
                borderColor: theme.palette.grey[100],
                "&:hover": {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2 }, width: 20 }}>
                <img
                  src={Google}
                  alt="Google"
                  width={16}
                  height={16}
                  style={{ marginRight: matchDownSM ? 8 : 16 }}
                />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: "unset",
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]} !important`,
                fontWeight: 500,
                borderRadius: theme.shape.borderRadius, // from MUI theme
                backgroundColor: theme.palette.background.paper,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign in with Email Address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // Implement form submission logic here (e.g., authenticate user)
            // 1) Send login request
            console.log(address);

            const response = await axiosInstance.post(address, {
              email: values.email,
              password: values.password,
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("Login successful:", response.data);

            // 2) Suppose the server returns { accessToken, refreshToken }
            const { accessToken, refreshToken } = response.data;
            if (response.data.expiresIn) {
              //scheduleTokenRefresh(response.data.expiresIn);
            }

            console.log("2");

            // const decoded = jwtDecode(accessToken);
            // console.log("3");
            // const userId = decoded.user.id;
            // console.log(decoded);
            // console.log("User ID:", userId);

            const verifyResponse = await axiosInstance.get("/auth/verify");
            console.log("User info from verify:", verifyResponse.data.user);
            console.log("4");
            // 4) Mark success, stop loading
            setStatus({ success: true });
            setSubmitting(false);
            console.log("5");
            // 5) Redirect to the dashboard
            navigate(`/dashboard/${verifyResponse.data.user.id}`);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address / Username
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ mt: 1 }}
            >
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Remember me"
              /> */}
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => {
                  // Implement forgot password logic or navigation here
                  console.log("Forgot Password Clicked");
                }}
              >
                Forgot Password?
              </Typography>
            </Stack>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </AnimateButton>
              <Typography
                position={"center"}
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => {
                  navigate("/form");
                  // Implement forgot password logic or navigation here
                  console.log("sign up Clicked");
                }}
              >
                Don't have an account?
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
