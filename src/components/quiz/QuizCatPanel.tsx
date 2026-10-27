import catDefault from '../../assets/character/quiz_cat_default.png';
import catWrong from '../../assets/character/quiz_cat_wrong.png';

export type QuizCatMood = 'idle' | 'correct' | 'wrong';

interface QuizCatPanelProps {
  mood: QuizCatMood;
  seed?: number;
}

const moods: Record<
  QuizCatMood,
  { messages: string[]; bubble: string; image: string }
> = {
  idle: {
    messages: [
      '정답을 골라봐 냥',
      '골라보라 냥!',
      '천천히 읽어봐 냥',
      '감으로 가도 된다 냥',
    ],
    bubble: 'bg-blue-50',
    image: catDefault,
  },
  correct: {
    messages: [
      '정답이다 냥!',
      '역시 큰손 될 냥!',
      '감 좋다 냥!',
      '이 정도는 기본이다 냥',
      '주가 오른다 냥!',
      '경제 천재다 냥!',
      '매수 신호다 냥!',
    ],
    bubble: 'bg-green-80',
    image: catDefault,
  },
  wrong: {
    messages: [
      '오답이다 냥..',
      '괜찮다 냥.. 아마도..',
      '펑.. 했다 냥',
      '손절이다 냥..',
      '다음엔 맞힌다 냥..',
      '털이 다 탔다 냥..',
      '이것도 공부다 냥..',
    ],
    bubble: 'bg-red-70',
    image: catWrong,
  },
};

//문제풀이 고양이 창 (seed로 문제마다 말풍선 문구를 바꿈)
const QuizCatPanel = ({ mood, seed = 0 }: QuizCatPanelProps) => {
  const { messages, bubble, image } = moods[mood];
  const message = messages[seed % messages.length];

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-[20px] border border-blue-15 bg-white pt-4 lg:w-86.5">
      <div className="flex w-60 flex-col items-center gap-6">
        <p
          aria-live="polite"
          className={`rounded-[20px] px-3 py-2 text-base leading-5.5 font-bold whitespace-nowrap text-blue-05 ${bubble}`}
        >
          {message}
        </p>
        <div className="relative h-50 w-full overflow-hidden">
          <img
            src={image}
            alt=""
            className="absolute top-[-37px] left-[-40px] size-80 max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizCatPanel;
