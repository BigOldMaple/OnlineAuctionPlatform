import React, { useState } from "react";

const SubmitButton = ({ text }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = () => {
    setIsSubmitting(true);
  };

  return (
    <button
      type="submit"
      className="btn btn-primary"
      onClick={handleSubmitClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner"></span>
          submitting...
        </>
      ) : (
        text || "submit"
      )}
    </button>
  );
};

export default SubmitButton;
