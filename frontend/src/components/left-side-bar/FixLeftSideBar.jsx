export function FixSideBar({ children, style, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "400px",
        minWidth: "50px",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SideBarItem({ children, style, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "block",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
