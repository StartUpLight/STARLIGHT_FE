'use client';
import { SelectedMentor } from '@/store/expert.store';
import Image from 'next/image';

type OrderDetailsProps = {
  mentor: SelectedMentor | null;
};

const OrderDetails = ({ mentor }: OrderDetailsProps) => {
  if (!mentor) {
    return null;
  }

  const { name, tags, careers, image } = mentor;

  return (
    <div className="mb-[11px] rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="ds-subtitle mb-4 font-semibold text-gray-900">주문내역</h2>
      <div className="flex items-start gap-3">
        <div className="flex h-[115px] w-[103px] flex-col items-center justify-center gap-1 rounded-xl px-4">
          <div className="relative h-full w-full">
            <Image
              src={image || '/images/sampleImage.png'}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="ds-text font-medium text-gray-800">
                  {name} 전문가
                </h3>
                <div className="flex flex-wrap items-center gap-1">
                  {tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={`${name}-tag-${tag}-${i}`}
                      className="ds-caption text-primary-500 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="my-2 h-px bg-gray-100" />

          <div className="flex flex-col gap-1">
            {careers.slice(0, 3).map((career, idx) => (
              <p
                key={`${name}-career-${idx}`}
                className="ds-subtext font-medium text-gray-600"
              >
                {typeof career === 'string'
                  ? career
                  : 'careerTitle' in career
                    ? career.careerTitle
                    : String(career)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
