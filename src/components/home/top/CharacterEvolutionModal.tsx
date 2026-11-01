import { useEffect, useId, useRef } from 'react';
import evolutionBackground from '../../../assets/streak/evolution_bg.svg';
import bigHandCat from '../../../assets/character/stand_2_cat.svg';
import nobleCat from '../../../assets/character/stand_3_cat.svg';
import type { CharacterEvolution } from '../../../utils/characterEvolution';

interface CharacterEvolutionModalProps {
  evolution: CharacterEvolution;
  onClose: () => void;
}

const CharacterEvolutionModal = ({
  evolution,
  onClose,
}: CharacterEvolutionModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="relative m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-103 overflow-y-auto rounded-3xl border-0 bg-white px-6 py-7 backdrop:bg-black/30 sm:px-8"
    >
      <span className="absolute top-5 left-4 rounded-lg border border-blue-60 px-3 py-2 text-xs font-semibold text-blue-60">
        진화
      </span>
      <div className="flex flex-col items-center text-center">
        <div className="relative mt-1 aspect-square w-full max-w-64 overflow-hidden">
          <img
            src={evolutionBackground}
            alt=""
            className="absolute inset-0 size-full object-contain"
          />
          <img
            src={evolution.stage === 'NOBLE' ? nobleCat : bigHandCat}
            alt={evolution.name}
            className="absolute -bottom-10 left-1/2 h-[120%] w-[120%] -translate-x-1/2 object-contain object-bottom"
          />
          <p className="absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-white">
            {evolution.name}이 됐다 냥!
          </p>
        </div>
        <h2
          id={titleId}
          className="mt-5 text-xl font-bold break-keep text-blue-60"
        >
          {evolution.name}으로 진화했어요
        </h2>
        <p className="mt-2 text-sm leading-6 break-keep text-gray-60">
          주가가 {evolution.stock.toLocaleString('ko-KR')}방울에 도달했어요.
          <br />
          {evolution.stage === 'NOBLE'
            ? 'COZ:E 최고 단계에 도착했어요!'
            : '꾸준히 푼 덕분이에요!'}
        </p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-8 h-15 w-40 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white hover:brightness-95"
        >
          확인
        </button>
      </div>
    </dialog>
  );
};

export default CharacterEvolutionModal;
