export function Button({ onClick, ...rest }) {
  return <div onClick={onClick} {...rest} />;
}
