import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cabangReducer } from "@/reducers/cabangReducers";
import { addData, updateData } from "@/actions";
import {
    API_URL_createcabang,
    API_URL_edelcabang,
} from "@/constants";
import {
    Container,
    TextField,
    Button,
} from "@/components";
import { IoMdReturnLeft } from "react-icons/io";

const CabangForm = () => {
    const { pk } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const coordinates = JSON.parse(state?.item?.cordinate || '{}');

    const isEdit = pk && pk !== 'add';

    const formik = useFormik({
        initialValues: {
            nama: state?.item?.nama || '',
            no_telepon: state?.item?.no_telepon || '',
            latitude: coordinates.latitude || '',
            longitude: coordinates.longitude || '',
            radius: state?.item?.radius || 25,
            senin_masuk: state?.item?.jadwal?.senin?.masuk || "08:00",
            senin_keluar: state?.item?.jadwal?.senin?.keluar || "17:00",
            selasa_masuk: state?.item?.jadwal?.selasa?.masuk || "08:00",
            selasa_keluar: state?.item?.jadwal?.selasa?.keluar || "17:00",
            rabu_masuk: state?.item?.jadwal?.rabu?.masuk || "08:00",
            rabu_keluar: state?.item?.jadwal?.rabu?.keluar || "17:00",
            kamis_masuk: state?.item?.jadwal?.kamis?.masuk || "08:00",
            kamis_keluar: state?.item?.jadwal?.kamis?.keluar || "17:00",
            jumat_masuk: state?.item?.jadwal?.jumat?.masuk || "08:00",
            jumat_keluar: state?.item?.jadwal?.jumat?.keluar || "17:00",
            sabtu_masuk: state?.item?.jadwal?.sabtu?.masuk || "00:00",
            sabtu_keluar: state?.item?.jadwal?.sabtu?.keluar || "00:00",
            minggu_masuk: state?.item?.jadwal?.minggu?.masuk || "00:00",
            minggu_keluar: state?.item?.jadwal?.minggu?.keluar || "00:00",
        },
        validationSchema: Yup.object().shape({
            nama: Yup.string().required("Nama is required"),
            latitude: Yup.string().required("Latitude is required"),
            longitude: Yup.string().required("Longitude is required"),
            radius: Yup.number().required("Radius is required"),
            senin_masuk: Yup.string().required("Senin Masuk is required"),
            senin_keluar: Yup.string().required("Senin Keluar is required"),
            selasa_masuk: Yup.string().required("Selasa Masuk is required"),
            selasa_keluar: Yup.string().required("Selasa Keluar is required"),
            rabu_masuk: Yup.string().required("Rabu Masuk is required"),
            rabu_keluar: Yup.string().required("Rabu Keluar is required"),
            kamis_masuk: Yup.string().required("Kamis Masuk is required"),
            kamis_keluar: Yup.string().required("Kamis Keluar is required"),
            jumat_masuk: Yup.string().required("Jumat Masuk is required"),
            jumat_keluar: Yup.string().required("Jumat Keluar is required"),
            sabtu_masuk: Yup.string().required("Sabtu Masuk is required"),
            sabtu_keluar: Yup.string().required("Sabtu Keluar is required"),
            minggu_masuk: Yup.string().required("Minggu Masuk is required"),
            minggu_keluar: Yup.string().required("Minggu Keluar is required"),
        }),
        onSubmit: async (values) => {
            try {
                const jadwal = JSON.stringify({
                    senin: {
                        masuk: values.senin_masuk,
                        keluar: values.senin_keluar
                    },
                    selasa: {
                        masuk: values.selasa_masuk,
                        keluar: values.selasa_keluar
                    },
                    rabu: {
                        masuk: values.rabu_masuk,
                        keluar: values.rabu_keluar
                    },
                    kamis: {
                        masuk: values.kamis_masuk,
                        keluar: values.kamis_keluar
                    },
                    jumat: {
                        masuk: values.jumat_masuk,
                        keluar: values.jumat_keluar
                    },
                    sabtu: {
                        masuk: values.sabtu_masuk,
                        keluar: values.sabtu_keluar
                    },
                    minggu: {
                        masuk: values.minggu_masuk,
                        keluar: values.minggu_keluar
                    },
                });

                const data = { ...values, jadwal };

                if (isEdit) {
                    await updateData(
                        { dispatch, redux: cabangReducer },
                        { pk: pk, ...data },
                        API_URL_edelcabang,
                        'UPDATE_CABANG'
                    );
                } else {
                    await addData(
                        { dispatch, redux: cabangReducer },
                        data,
                        API_URL_createcabang,
                        'ADD_CABANG'
                    );
                }
                navigate('/masterdata/cabang');
            } catch (error) {
                console.error('Error in form submission: ', error);
            }
        },
    });

    return (
        <div>
            <Container>
                <div className='flex items-center gap-2 mb-4'>
                    <button
                        className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
                        onClick={() => navigate("/masterdata/cabang")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Cabang' : 'Tambah Cabang'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <div className="flex gap-4">
                            <TextField
                                required
                                label="Nama Cabang"
                                name="nama"
                                value={formik.values.nama}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nama ? formik.errors.nama : ''}
                            />
                            <TextField
                                label="No Telepon"
                                name="no_telepon"
                                value={formik.values.no_telepon}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.no_telepon ? formik.errors.no_telepon : ''}
                            />
                        </div>
                        <div className="flex gap-4">
                            <TextField
                                required
                                label="Latitude"
                                name="latitude"
                                value={formik.values.latitude}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.latitude ? formik.errors.latitude : ''}
                            />
                            <TextField
                                required
                                label="Longitude"
                                name="longitude"
                                value={formik.values.longitude}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.longitude ? formik.errors.longitude : ''}
                            />
                        </div>
                        <TextField
                            required
                            label="Radius"
                            name="radius"
                            type="number"
                            value={formik.values.radius}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.radius ? formik.errors.radius : ''}
                        />
                        {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map(day => (
                            <div key={day} className='flex gap-4'>
                                <TextField
                                    required
                                    label={`${day.charAt(0).toUpperCase() + day.slice(1)} Masuk`}
                                    name={`${day}_masuk`}
                                    type="time"
                                    value={formik.values[`${day}_masuk`]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[`${day}_masuk`] ? formik.errors[`${day}_masuk`] : ''}
                                />
                                <TextField
                                    required
                                    label={`${day.charAt(0).toUpperCase() + day.slice(1)} Keluar`}
                                    name={`${day}_keluar`}
                                    type="time"
                                    value={formik.values[`${day}_keluar`]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[`${day}_keluar`] ? formik.errors[`${day}_keluar`] : ''}
                                />
                            </div>
                        ))}
                        <div className="mt-6 flex justify-end">
                            <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default CabangForm;
