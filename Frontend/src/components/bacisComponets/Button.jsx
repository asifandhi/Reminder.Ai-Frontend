import React from 'react'
import { useSelector } from 'react-redux'
import theme from "../../theme.js"

function Button({
    children,
    type = "button",
    className = "",
    variant = "primary",
    disabled = false,
    ...props
}) {
    const t = theme["dark"];

    const base = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer";

    const variants = {
        primary: `text-white`,
        ghost: `bg-transparent border hover:bg-white/10`,
        danger: `bg-red-500 hover:bg-red-600 text-white`,
        success: `bg-green-500 hover:bg-green-600 text-white`,
        cta: `font-bold hover:opacity-90 active:scale-95`,
    }

    let customStyle = {};
    if (variant === "primary") customStyle = { backgroundColor: t.primary };
    else if (variant === "ghost") customStyle = { borderColor: t.border, color: t.textSecondary };
    else if (variant === "cta") customStyle = { backgroundColor: "#00d1ff", color: "#003543" };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${base} ${variants[variant] || ""} ${className}`}
            style={customStyle}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button