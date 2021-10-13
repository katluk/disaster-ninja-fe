import { TranslationService as i18n } from '~core/localization';
import { Event } from '~appModule/types';
import { Panel, Text } from '@k2-packages/ui-kit';
import { EventCard } from '../EventCard/EventCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './EventsListPanel.module.css';

export function EventsListPanel({
  current,
  onCurrentChange,
  error,
  loading,
  eventsList,
}: {
  current: string | null;
  onCurrentChange: (id: string) => void;
  error: string | null;
  loading: boolean;
  eventsList: Event[] | null;
}) {
  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  return (
    <Panel header={<Text type="heading-l">{i18n.t('Ongoing disasters')}</Text>}>
      <div className={s.scrollable}>
        {statesToComponents({
          loading: <LoadingSpinner />,
          error: <ErrorMessage />,
          ready: (eventsList) =>
            eventsList.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isActive={event.id === current}
                onClick={onCurrentChange}
              />
            )),
        })}
      </div>
    </Panel>
  );
}
