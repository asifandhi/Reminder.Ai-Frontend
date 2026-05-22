// src/components/bacisComponets/Input.jsx
import { useSelector } from "react-redux";
import theme from "../../theme.js";

function Input({ 
    label,
    id,
     value,
    type = "text",
    className = "",
    ...props
}) 
{
  const t = theme["dark"];

  return (
    <div>
        {
                label &&
                <label className='inline-block mb-1 pl-1 font-semibold' htmlFor={id}  style={{ color: t.text }} >
                    {label}
                </label>
            }

    <input
    id={id}
      type={type}
      value={value}
      className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 ${className}`}
      style={{
          backgroundColor: t.bgSecondary,
          color: t.text,
          border: `1px solid ${t.border}`,
          ...props.style,
        }}
        {...props}
        />
        </div>
  );
}

export default Input;