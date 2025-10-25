import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import ApiService from '../../ApiService';
import ItemRow from './OrderItemRow';
import GroupRow from './OrderGroupRow';
import './HistoryOfOrders.css';

function OrdersTable() {
    const [groups, setGroups] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useRef(null);

    const fetchGroupedOrders = async () => {
        try {
            const response = await ApiService.findGroupedOrders();
            setGroups(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroupedOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        try {
            await ApiService.deleteOrder(orderId);
            const newGroups = groups.map(group => ({
                ...group,
                orders: group.orders.filter(o => o.id !== orderId)
            })).filter(group => group.orders.length > 0);
            setGroups(newGroups);
            toast.current.show({ severity: 'success', summary: 'Επιτυχία', detail: 'Η παραγγελία διαγράφηκε.', life: 3000 });
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία διαγραφής παραγγελίας.', life: 3000 });
        }
    };

    const handleDeleteGroup = async (group) => {
        try {
            await Promise.all(group.orders.map(order => ApiService.deleteOrder(order.id)));
            setGroups(groups.filter(g => g !== group));
            toast.current.show({ severity: 'success', summary: 'Επιτυχία', detail: 'Το group διαγράφηκε.', life: 3000 });
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία διαγραφής group.', life: 3000 });
        }
    };

    const filteredGroups = groups.filter(group => {
        const fromStr = group.from ? group.from.toString() : '';
        const toStr = group.to ? group.to.toString() : '';
        const groupMatches = fromStr.includes(searchTerm) || toStr.includes(searchTerm);
        const ordersMatch = group.orders.some(order =>
            order.orderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.createdAt?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return groupMatches || ordersMatch;
    });

    const rowExpansionTemplate = (group) => {
        const filteredOrders = group.orders.filter(order =>
            order.orderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.createdAt?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="p-3">
                <DataTable value={filteredOrders} responsiveLayout="scroll" tableStyle={{ minWidth: '30rem' }}>
                    <Column field="orderName" header="Ονομα Προϊόντος" style={{ width: '30%' }} />
                    <Column field="description" header="Περιγραφή" style={{ width: '40%' }} />
                    <Column field="quantity" header="Ποσότητα" style={{ width: '15%' }} />
                    <Column field="createdAt" header="Ημερομηνία" style={{ width: '15%' }} />
                    <Column
                        body={(order) => <ItemRow item={order} onDelete={handleDeleteOrder} />}
                        header="Διαγραφή"
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div style={{ marginTop: '20px', padding: '20px', margin: 'auto' }}>
                <InputText
                    placeholder="Αναζήτηση..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-text-search"
                />

                <DataTable
                    value={filteredGroups}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey={(row) => `${row.from}_${row.to}`}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column expander style={{ width: '3rem' }} />
                    <Column field="from" header="Ημερομηνία Από" style={{ width: '25%' }} />
                    <Column field="to" header="Ημερομηνία Έως" style={{ width: '25%' }} />
                    <Column field="orders.length" header="Αριθμός Παραγγελιών" style={{ width: '25%' }} />
                    <Column
                        body={(group) => <GroupRow group={group} onDelete={handleDeleteGroup} />}
                        header="Διαγραφή Group"
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>
        </div>
    );
}

export default OrdersTable;