interface AvatarProps {
  src?: string | null;
  size?: number;
  zoom?: boolean;
}

const Avatar = ({ src, size = 40, zoom = false }: AvatarProps) =>
  src ? (
    zoom ? (
      <div
        style={{ width: size, height: size }}
        className="overflow-hidden rounded-full border border-blue-15"
      >
        <img
          src={src}
          alt=""
          className="size-full origin-[50%_0%] scale-[1.6] object-cover"
        />
      </div>
    ) : (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="rounded-full border border-blue-15 object-cover"
      />
    )
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border border-blue-15 bg-gray-20"
    />
  );

export default Avatar;
