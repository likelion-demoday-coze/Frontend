interface AvatarProps {
  src?: string | null;
  size?: number;
}

const Avatar = ({ src, size = 32 }: AvatarProps) =>
  src ? (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size }}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-20"
    />
  );

export default Avatar;
