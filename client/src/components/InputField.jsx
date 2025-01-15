import visibility_off from "@mui/icons-material/VisibilityOff";
import visibility from "@mui/icons-material/Visibility";
import { useState } from "react";
import PropTypes from "prop-types";

const InputField = ({ type, placeholder, icon, value, onChange }) => {
  // State to toggle password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      {/* Input Element */}
      <input
        type={isPasswordShown && type === "password" ? "text" : type}
        placeholder={placeholder}
        className="input-field"
        required
        value={value}
        onChange={onChange}
      />

      {/* Main Icon (e.g., mail or lock) */}
      <i className="material-symbols-rounded">{icon}</i>

      {/* Toggle Password Visibility Icon */}
      {type === "password" && (
        <i
          onClick={() => setIsPasswordShown((prev) => !prev)}
          className="material-symbols-rounded eye-icon"
          style={{ cursor: "pointer" }}
        >
          {isPasswordShown ? "visibility" : "visibility_off"}
        </i>
      )}
    </div>
  );
};

// PropTypes for clarity and type-checking
InputField.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  /**
   * `icon` is expected to be a string for the <i> element,
   * e.g. "mail", "lock", "person", etc.
   */
  icon: PropTypes.string.isRequired,
  /**
   * `value` and `onChange` ensure this is a controlled component,
   * so the parent can manage the input's state.
   */
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;
