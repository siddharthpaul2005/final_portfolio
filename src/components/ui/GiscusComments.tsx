import Giscus from '@giscus/react';
import { useEffect, useState, memo } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import './giscus-comments.css';
import { giscus } from '../../data/site';

interface GiscusCommentsProps {
  slug: string;
}

const GiscusComments = ({ slug }: GiscusCommentsProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [slug]);

  // Not configured yet (see data/site.ts) — render nothing instead of a broken widget.
  if (!isLoaded || !giscus.repoId || !giscus.categoryId) {
    return null;
  }

  const giscusTheme = theme === 'dark' ? 'transparent_dark' : 'light';

  return (
    <div className="mt-6 pt-4">
      <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-6 font-hanken">
        Comments
      </h4>
      <div className="giscus-wrapper">
        <Giscus
          key={`giscus-${slug}-${giscusTheme}`}
          id="comments"
          repo={giscus.repo}
          repoId={giscus.repoId}
          category={giscus.category}
          categoryId={giscus.categoryId}
          mapping="specific"
          term={`blog-{${slug}}`}
          emitMetadata="0"
          inputPosition="bottom"
          theme={giscusTheme}
          lang="en"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default memo(GiscusComments);
