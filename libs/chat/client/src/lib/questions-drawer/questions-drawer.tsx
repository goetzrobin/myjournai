import useMeasure from 'react-use-measure';
import { Drawer } from 'vaul';
import { AnimatePresence, motion } from 'framer-motion';
import { LucideX } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { Survey, SurveyView } from './survey';
import { Button } from '~myjournai/components';


export type QuestionDrawerScores = {
  anxietyScore: number;
  feelingScore: number;
  motivationScore: number;
}

export default function QuestionsDrawer({ open, setOpen, renderFinalStep, title, onClosePressed }: {
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  title: string;
  onClosePressed?: () => void;
  renderFinalStep: (scores: Partial<QuestionDrawerScores>) => ReactNode
}) {
  const [anxietyScore, setAnxietyScore] = useState<number | undefined>(undefined);
  const [feelingScore, setFeelingScore] = useState<number | undefined>(undefined);
  const [motivationScore, setMotivationScore] = useState<number | undefined>(undefined);
  const [view, setView] = useState<SurveyView>('feeling');
  const [elementRef, bounds] = useMeasure();
  console.log(view)

  return (
    <Drawer.Root open={open}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-10 bg-black/30"
        />
        <Drawer.Content
          asChild
          className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-background outline-none md:mx-auto md:w-full"
        >
          <motion.div
            animate={{
              height: bounds.height,
              transition: {
                duration: 0.27,
                ease: [0.25, 1, 0.5, 1]
              }
            }}
          >
            <Drawer.Close asChild>
              <Button
                variant="icon"
                onPress={onClosePressed ?? (() => setOpen?.(false))}
                data-vaul-no-drag=""
                className="absolute right-8 top-7 z-10 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <LucideX />
              </Button>
            </Drawer.Close>
            <div ref={elementRef} className="px-6 pb-6 pt-2.5 antialiased">
              <AnimatePresence initial={false} mode="popLayout" custom={view}>
                <Drawer.Title className="sr-only">{title}</Drawer.Title>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  key={view}
                  transition={{
                    duration: 0.27,
                    ease: [0.26, 0.08, 0.25, 1]
                  }}
                >
                  <Survey
                    renderFinalStep={renderFinalStep}
                    view={view}
                    setView={setView}
                    anxietyScore={anxietyScore}
                    setAnxietyScore={setAnxietyScore}
                    feelingScore={feelingScore}
                    setFeelingScore={setFeelingScore}
                    motivationScore={motivationScore}
                    setMotivationScore={setMotivationScore}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
