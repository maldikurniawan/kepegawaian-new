import React from "react";
import { icons } from "../../../public/icons";
import { Link } from "react-router-dom";

const CompCardContainer = ({
  children,
  cardColor,
  directionColor,
  title,
  icon,
  onEdit,
}) => {
  const colorDirect = () => {
    return directionColor === "right"
      ? "bg-gradient-to-r"
      : directionColor === "bottomRight"
      ? "bg-gradient-to-br"
      : directionColor === "bottom"
      ? "bg-gradient-to-b"
      : directionColor === "bottomLeft"
      ? "bg-gradient-to-bl"
      : directionColor === "left"
      ? "bg-gradient-to-l"
      : directionColor === "topLeft"
      ? "bg-gradient-to-tl"
      : directionColor === "top"
      ? "bg-gradient-to-t"
      : directionColor === "topRight"
      ? "bg-gradient-to-tr"
      : "bg-gradient-to-br";
  };

  return (
    <div
      className={`w-full border border-gray-100 shadow-md p-3 rounded-xl ${colorDirect()} from-white ${
        cardColor ? cardColor : "to-white"
      }`}
    >
      {(title || onEdit) && (
        <div className="flex justify-between items-center pb-4">
          {title && (
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-bold">
                {icon && <span className="mr-2 p-3 rounded-xl">{icon}</span>}
                <span className="">{title}</span>
              </div>
            </div>
          )}

          {onEdit && (
            <Link to={onEdit.link} state={{ data: onEdit.data }}>
              {icons.fiedit}
            </Link>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default CompCardContainer;
