import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button, Textarea, TextInput, Modal, LoadingOverlay } from '@mantine/core';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../../Content/AuthContext';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { visitReasons } from "../../../Data/DropdownData";

const Appointment = () => {
    const [customers, setCustomers] = useState([]);
    const [visible, { open: showOverlay, close: hideOverlay }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [representatives] = useState([
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]);
    const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

    const getSeverity = (status) => {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    const [doctors, setDoctors] = useState([]);
    const { getDoctorDropdown, user, createAppointment } = useAuth();
    useEffect(() => {
        // Dữ liệu mẫu
        const mockData = [
            {
                id: 1,
                name: 'John Doe',
                country: { name: 'United States', code: 'us' },
                representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
                date: new Date('2024-08-10'),
                balance: 3200.5,
                status: 'qualified',
                activity: 75
            },
            {
                id: 2,
                name: 'Maria Anders',
                country: { name: 'Germany', code: 'de' },
                representative: { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
                date: new Date('2024-06-12'),
                balance: 2500.2,
                status: 'new',
                activity: 55
            },
            {
                id: 3,
                name: 'Thomas Hardy',
                country: { name: 'UK', code: 'gb' },
                representative: { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
                date: new Date('2024-03-25'),
                balance: 1800.0,
                status: 'negotiation',
                activity: 30
            },
            {
                id: 4,
                name: 'Ana Trujillo',
                country: { name: 'Spain', code: 'es' },
                representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
                date: new Date('2024-10-03'),
                balance: 4100.75,
                status: 'renewal',
                activity: 90
            },
            {
                id: 5,
                name: 'Michael Scott',
                country: { name: 'Canada', code: 'ca' },
                representative: { name: 'Stephen Shaw', image: 'stephenshaw.png' },
                date: new Date('2024-09-15'),
                balance: 5200.0,
                status: 'unqualified',
                activity: 20
            }
        ];


        const fetchDoctors = async () => {
            const data = await getDoctorDropdown();
            setDoctors(data.map(d => ({
                label: `${d.name} (${d.specialization})`,
                value: d.id
            })));
        };
        fetchDoctors();

        setCustomers(mockData);
    }, [getDoctorDropdown]);


    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <Button leftSection={<IconPlus/>} onClick={open} variant='filled'>Đặt lịch</Button>
                <TextInput leftSection={<IconSearch />} fw={500} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </div>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
                <span>{rowData.country.name}</span>
            </div>
        );
    };

    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;

        return (
            <div className="flex align-items-center gap-2">
                <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
                <span>{representative.name}</span>
            </div>
        );
    };

    const representativeFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <div className="mb-3 font-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </React.Fragment>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
                <span>{option.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.balance);
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const activityBodyTemplate = (rowData) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>;
    };

    const activityFilterTemplate = (options) => {
        return (
            <>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </>
        );
    };

    const actionBodyTemplate = () => {
        return <Button>haha</Button>;
    };

    const form = useForm({
        initialValues: {
            doctorId: '',
            appointmentDate: null,
            reason: '',
            notes: '',
        },
        validate: {
            doctorId: (value) => (!value ? 'Vui lòng chọn bác sĩ' : null),
            appointmentDate: (value) => (!value ? 'Vui lòng chọn ngày giờ' : null),
            reason: (value) => (!value.trim() ? 'Vui lòng nhập lý do' : null),
        },
    });

    const handleSubmit = async (values) => {
        try {
        setLoading(true);
        showOverlay();

        const dto = {
            doctorId: values.doctorId,
            patientId: user?.profileId,
            appointmentDate: dayjs(values.appointmentDate).format('YYYY-MM-DDTHH:mm:ss'),
            reason: values.reason,
            notes: values.notes,
        };

            await createAppointment(dto);
            form.reset();
            close();
        } finally {
            setLoading(false);
            hideOverlay();
        }
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={customers} paginator header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id" selectionMode="checkbox" selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                    filters={filters} filterDisplay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
                    emptyMessage="No customers found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
                <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
                <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
                    style={{ minWidth: '14rem' }} body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} />
                <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                <Column field="balance" header="Balance" sortable dataType="numeric" style={{ minWidth: '12rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column field="activity" header="Activity" sortable showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
            </DataTable>

            <Modal opened={opened} onClose={close} size="lg" title={<div className="text-xl font-semibold text-green-400">Đặt lịch</div>} centered>

            <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
                <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-5">

                    {/* Dropdown bác sĩ */}
                    <div>
                        <label htmlFor="doctor" className="font-semibold">
                            Bác sĩ <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            id="doctor"
                            value={form.values.doctorId}
                            options={doctors}
                            onChange={(e) => form.setFieldValue('doctorId', e.value)}
                            placeholder="Chọn bác sĩ"
                            className="w-full md:w-30rem"
                        />
                        {form.errors.doctorId && (
                            <p className="text-red-500 text-sm mt-1">{form.errors.doctorId}</p>
                        )}
                    </div>

                    {/* Ngày giờ khám */}
                    <DateTimePicker
                        withAsterisk
                        label="Ngày & giờ khám"
                        placeholder="Chọn ngày và giờ hẹn"
                        minDate={new Date()}
                        value={form.values.appointmentDate}
                        onChange={(val) => form.setFieldValue('appointmentDate', val)}
                        error={form.errors.appointmentDate}
                    />

                    {/* Lý do */}
                    <div>
                        <label htmlFor="reason" className="font-semibold">
                            Lý do khám <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            id="reason"
                            value={form.values.reason}
                            options={visitReasons.map((r) => ({ label: r, value: r }))}
                            onChange={(e) => form.setFieldValue('reason', e.value)}
                            placeholder="Chọn lý do khám"
                            className="w-full md:w-30rem"
                        />
                        {form.errors.reason && (
                            <p className="text-red-500 text-sm mt-1">{form.errors.reason}</p>
                        )}
                    </div>


                    {/* Ghi chú */}
                    <Textarea
                        label="Ghi chú"
                        placeholder="Viết ghi chú (không bắt buộc)"
                        {...form.getInputProps('notes')}
                    />

                    {/* Nút Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                    >
                        {loading ? 'Đang gửi...' : 'Đặt lịch'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
        
export default Appointment;