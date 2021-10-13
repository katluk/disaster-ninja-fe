import { useEffect, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config/runtime';
import { ConnectedMap } from '~components/ConnectedMap/ConnectedMap';
import { Row } from '~components/Layout/Layout';
import styles from './Main.module.css';

const { SideBar } = lazily(() => import('~features/side_bar'));
const { EventList } = lazily(() => import('~features/events_list'));

function MainView() {
  useEffect(() => {
    /* Lazy load module */
    // TODO: Add feature flag check
    import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    import('~features/geometry_uploader').then(({ initFileUploader }) =>
      initFileUploader(),
    );
    import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <Row>
        <Suspense fallback={null}>
          <SideBar />
          <EventList />
        </Suspense>
        <div className={styles.root} style={{ flex: 1, position: 'relative' }}>
          <ConnectedMap
            options={
              Object.assign(config.map.centerPoint, {
                logoPosition: 'top-right',
              }) as any
            }
            style={config.map.style || ''}
            accessToken={config.map.accessToken || ''}
            className={styles.Map}
          />
          <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </Row>
    </>
  );
}

export default MainView;
