interface QuestionTextProps {
  children: string;
}

//퀴즈 문제 문장
const QuestionText = ({ children }: QuestionTextProps) => {
  return (
    <h2 className="text-lg leading-7 font-medium break-keep whitespace-pre-line text-black lg:text-2xl lg:leading-9">
      {children}
    </h2>
  );
};

export default QuestionText;
