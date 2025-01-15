import Google from "../assets/images/social-google.svg"; // Import Google logo
//import Apple from "../../assets/images/social-apple.svg"; // Example for Apple logo

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button className="social-button">
        <img src={Google} alt="Google" className="social-icon" />
        Google
      </button>
      {/* <button className="social-button">
        <img src="apple.svg" alt="Apple" className="social-icon" />
        Apple
      </button> */}
    </div>
  );
};
export default SocialLogin;
