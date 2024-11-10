import React from "react";

const FormInput = ({ label, name, type = "text", defaultValue = "" }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};

export default FormInput;
