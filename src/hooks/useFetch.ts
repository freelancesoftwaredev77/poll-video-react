/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import React from 'react';

const useFetch = (tableName: string) => {
  const [data, setData] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    setData([]);
    const { data: tableData, error: tableError } = await supabase
      .from(tableName)
      .select('*');
    if (tableData) {
      setIsLoading(false);
      setData(tableData);
    }
    if (tableError) {
      setIsLoading(false);
      toastAlert('error', 'Something went wrong... Please try again later');
    }
  }, []);

  React.useEffect(() => {
    getData();
  }, [getData, tableName]);

  return { isLoading, data, getData };
};

export default useFetch;
