'use client';
import { useRef } from 'react';
import FeedBackHeader from './compoents/FeedBackHeader';
import FeedBackForm from './compoents/FeedBackForm';
import { FeedBackFormHandle } from '@/types/feedback/sections';

const ExpertWritePage = () => {
    const formRef = useRef<FeedBackFormHandle>(null);

    const handleComplete = () => {
        // const data = formRef.current?.getFeedback();
        // console.log('피드백 데이터:', data);
    };

    return (
        <>
            <FeedBackHeader onComplete={handleComplete} />
            <FeedBackForm ref={formRef} />
        </>
    );
};

export default ExpertWritePage;