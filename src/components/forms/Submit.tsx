const Submit = ({
  value,
  disabled = false,
}: {
  value: string;
  disabled?: boolean;
}) => {
  return (
    <input
      {...{ value, disabled }}
      type="submit"
      className="w-full cursor-pointer rounded-md bg-AliceBlue-400 py-2 font-semibold text-white transition-colors hover:bg-AliceBlue-500"
    />
  );
};

export { Submit };
