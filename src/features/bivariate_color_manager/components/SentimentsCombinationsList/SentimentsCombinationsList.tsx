import clsx from 'clsx';
import { useState } from 'react';
import { capitalizeArrayOrString, sortByKey } from '~utils/common';
import { i18n } from '~core/localization';
import { MiniLegend } from '~features/bivariate_color_manager/components/MiniLegend/MiniLegend';
import s from './SentimentsCombinationsList.module.css';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { ColorTheme } from '~core/types';

type Row = {
  key: string;
  maps: number;
  verticalLabel: string;
  horizontalLabel: string;
  legend: ColorTheme | undefined;
};

type SentimentsCombinationsListProps = {
  data: BivariateColorManagerData;
};

const sortDescendingByMaps = sortByKey<Row>('maps', 'desc');

const convertDirectionsArrayToLabel = (directions: string[][]) => {
  const [from = '', to = ''] = directions;
  return `${capitalizeArrayOrString(from)} → ${capitalizeArrayOrString(to)}`;
};

const SentimentsCombinationsList = ({
  data,
}: SentimentsCombinationsListProps) => {
  const [selectedRowKey, setSelectedRowKey] = useState<string>();

  const columns = [
    { title: i18n.t('Legend'), className: clsx(s.centered) },
    { title: i18n.t('Maps'), className: clsx(s.centered) },
    { title: i18n.t('Vertical direction') },
    { title: i18n.t('Horizontal direction') },
  ];

  const rows: Row[] = Object.entries(data)
    .map(([key, value]) => {
      const { maps, legend } = value;
      const keyParsed = JSON.parse(key);
      const verticalLabel = convertDirectionsArrayToLabel(keyParsed.vertical);
      const horizontalLabel = convertDirectionsArrayToLabel(
        keyParsed.horizontal,
      );
      return {
        key,
        maps,
        verticalLabel,
        horizontalLabel,
        legend,
      };
    })
    .sort(sortDescendingByMaps);

  return (
    <table className={clsx(s.table)}>
      <thead>
        <tr>
          {columns.map(({ title, className }) => (
            <th key={title} className={className}>
              {title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(({ key, legend, maps, verticalLabel, horizontalLabel }) => {
          const rowSelected = selectedRowKey === key;
          const selectRow = () => setSelectedRowKey(key);

          return (
            <>
              <tr
                key={key}
                onClick={selectRow}
                className={clsx(rowSelected && s.rowSeleted)}
              >
                <td>
                  <div className={clsx(s.legendWrapper)}>
                    {legend && <MiniLegend legend={legend} />}
                  </div>
                </td>
                <td className={clsx(s.centered)}>{maps}</td>
                <td className={clsx(s.label)}>{verticalLabel}</td>
                <td className={clsx(s.label)}>{horizontalLabel}</td>
              </tr>
              {rowSelected && (
                <tr>
                  <td />
                  <td />
                  <td>koko</td>
                  <td>koko</td>
                </tr>
              )}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export { SentimentsCombinationsList };
