import type { Ref } from 'vue';

function pagination<T = any>(list: T[], pageNo: number, pageSize: number): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  const ret =
    offset + Number(pageSize) >= list.length
      ? list.slice(offset)
      : list.slice(offset, offset + Number(pageSize));
  return ret;
}

export function usePagination<T = any>(list: Ref<T[]>, pageSize: number) {
  const pageRef = ref(1);
  const pageSizeRef = ref(pageSize);

  const getPaginationList = computed(() => {
    return pagination(unref(list), unref(pageRef), unref(pageSizeRef));
  });

  const getTotal = computed(() => {
    return unref(list).length;
  });

  function setPage(page: number) {
    pageRef.value = page;
  }

  function setPageSize(pageSize: number) {
    pageSizeRef.value = pageSize;
  }

  return { setPage, getTotal, setPageSize, getPaginationList };
}
