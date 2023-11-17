export type ArticleReviewProps = {
  id: number;
  file: string;
  originalFile: string;
  articleDiscussions: Discussion[];
  createdAt: string;
  updatedAt: string;
};

export type Discussion = {
  createdAt: string;
  id: number;
  isReviewer: boolean;
  value: string;
};
