import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addData,
  deleteData,
  getData,
  updateData,
} from '@/actions';
import { jabatanReducers } from '@/reducers/strataReducers';
import {
  API_URL_createjabatan,
  API_URL_edeljabatan,
  API_URL_getjabatan,
} from '@/constants';
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
} from '@/components';
import * as Yup from 'yup';
import { debounce } from 'lodash'; // Import lodash debounce

const JabatanSub = () => {
  const {
    getJabatanResult,
    getJabatanLoading,
    getJabatanError,
    addJabatanResult,
    addJabatanLoading,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
  } = useSelector((state) => state.strata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const validationSchema = Yup.object().shape({
    nama_jabatan: Yup.string().required("Nama Jabatan is required"),
    keterangan: Yup.string(),
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = value
        ? { param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}` }
        : { param: `?limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }, 300),
    [limit, pageActive]
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate('/jabatan/form');
  };

  const onEdit = (item) => {
    navigate(`/jabatan/form/${item.pk}`);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: jabatanReducers },
      item.pk,
      API_URL_edeljabatan,
      "DELETE_JABATAN"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: jabatanReducers },
        param,
        API_URL_getjabatan,
        "GET_JABATAN"
      );
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page
    const param = search
      ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
      : { param: `?limit=${limit}&offset=${offset}` };

    get(param);
    setPageActive(page - 1); // Set the active page
  };

  const handleSelect = (newLimit) => {
    const param = search
      ? { param: `?search=${search}&limit=${newLimit}` }
      : { param: `?limit=${newLimit}` };
    get(param);
    setLimit(newLimit);
    setPageActive(0);
  };

  const [actions] = useState([
    {
      name: "Edit",
      icon: icons.bspencil,
      color: "text-green-500",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: icons.citrash,
      color: "text-red-500",
      func: doDelete,
    },
  ]);

  useEffect(() => {
    const param = { param: "?limit=" + limit + "&offset=" + pageActive * limit };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (
      addJabatanResult ||
      addPangkatResult ||
      deleteJabatanResult ||
      deletePangkatResult
    ) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    addJabatanResult,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getJabatanResult.results
    ? getJabatanResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1,
    }))
    : [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
            />
          </div>
          <Button onClick={onAdd}>Tambah Jabatan</Button>
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>Nama Jabatan</Tables.Header>
              <Tables.Header>Keterangan</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.pk}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.nama}</Tables.Data>
                <Tables.Data>{item.keterangan}</Tables.Data>
                <Tables.Data center>
                  <div className="flex items-center justify-center gap-2">
                    {actions.map((action) => (
                      <Tooltip key={action.name} tooltip={action.name}>
                        <div
                          key={action.name}
                          onClick={() => action.func(item)}
                          className={action.color}
                        >
                          {action.icon}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </Tables.Data>
              </Tables.Row>
            ))}
          </Tables.Body>
        </Tables>
        <div className="flex justify-between items-center mt-4">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          <Pagination
            totalCount={getJabatanResult.count} // Total items count from the API result
            pageSize={limit} // Items per page (limit)
            currentPage={pageActive + 1} // Current page
            onPageChange={handlePageClick} // Page change handler
            siblingCount={1} // Number of sibling pages (adjust as needed)
            activeColor="primary" // Optional: active page color
            rounded="md" // Optional: rounded button style
            variant="flat" // Optional: button variant
            size="md" // Optional: button size
          />
        </div>
      </Container>
    </div>
  );
};

export default JabatanSub;
