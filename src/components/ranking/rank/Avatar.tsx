interface AvatarProps {
  src?: string | null;
  size?: number;
}

const Avatar = ({ src, size = 40 }: AvatarProps) =>
  src ? (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size }}
      className="rounded-full border border-blue-15 object-cover"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border border-blue-15 bg-gray-20"
    />
  );

export default Avatar;
