"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default TopicCard;