export const sections = [
    {
        key: 'summary',
        title: '총평',
        placeholder: '사업계획서에 대한 전반적인 평가를 작성해주세요.',
    },
    {
        key: 'strength',
        title: '강점',
        placeholder: '사업계획서의 강점을 작성해주세요.',
    },
    {
        key: 'weakness',
        title: '약점',
        placeholder: '사업계획서의 약점을 작성해주세요.',
    },
] as const;

export type SectionKey = (typeof sections)[number]['key'];

export type FeedBackFormHandle = {
    getFeedback: () => Record<SectionKey, string>;
};
