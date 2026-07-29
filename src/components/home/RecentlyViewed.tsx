import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import { getRecentProfiles, type RecentProfile } from '@/lib/offlineCache';

/**
 * Recently viewed profiles saved on the device. Available with no network,
 * giving the installed app a persistent local library.
 */
const RecentlyViewed = () => {
  const [recents, setRecents] = useState<RecentProfile[]>([]);

  useEffect(() => {
    getRecentProfiles().then(setRecents).catch(() => undefined);
  }, []);

  if (recents.length === 0) return null;

  return (
    <section className="mb-8" aria-labelledby="recently-viewed-heading">
      <div className="flex items-center gap-2 mb-3">
        <History className="h-4 w-4 text-primary" />
        <h2 id="recently-viewed-heading" className="text-sm font-semibold">
          Recently viewed
        </h2>
        <span className="text-[10px] text-muted-foreground">saved on this device</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
        {recents.slice(0, 8).map((p) => (
          <Link
            key={p.id}
            to={`/profile/${p.id}`}
            className="group rounded-xl border border-border/50 bg-card/50 p-2 text-center hover:border-primary/50 transition-colors"
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mx-auto mb-1"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/15 mx-auto mb-1" />
            )}
            <span className="block text-[10px] md:text-xs truncate text-muted-foreground group-hover:text-foreground">
              {p.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
