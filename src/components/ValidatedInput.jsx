import React, { useId, useState } from 'react';

export function ValidatedInput({ onChange, id, ...props }) {
  const generatedId = useId();
  const [message, setMessage] = useState('');
  const inputId = id ?? generatedId;
  const errorId = inputId + '-error';

  return (
    <>
      <input
        {...props}
        id={inputId}
        aria-invalid={message ? true : props['aria-invalid']}
        aria-describedby={message ? errorId : props['aria-describedby']}
        onInvalid={event => setMessage(event.currentTarget.validationMessage)}
        onChange={event => {
          if (message) setMessage(event.currentTarget.validationMessage);
          onChange?.(event);
        }}
      />
      {message && <span id={errorId} className="block mt-1 text-xs text-red-400">{message}</span>}
    </>
  );
}
