import {
    ParamsType,
    ProTable,
    ProTableProps,
} from '@ant-design/pro-components';
import vi_VN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';

const DataTable = <
    T extends Record<string, any>,
    U extends ParamsType = ParamsType,
    ValueType = 'text',
>({
    columns,
    defaultData = [],
    dataSource,
    postData,
    pagination,
    loading,
    rowKey = (record: any) => record.id,
    scroll,
    params,
    request,
    search,
    polling,
    toolBarRender,
    headerTitle,
    actionRef,
    dateFormatter = 'string',
    rowSelection,
}: ProTableProps<T, U, ValueType>) => {
    return (
        <ConfigProvider
            locale={vi_VN}
            theme={{
                token: {
                    colorPrimary: '#2563eb',
                },
                components: {
                    Table: {
                        headerBg: '#f8fafc',
                        headerColor: '#1e293b',
                        rowHoverBg: '#f1f5f9',
                    }
                }
            }}
        >
            <div style={{
                background: '#ffffff',
                borderRadius: 14,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
            }}>
                <ProTable<T, U, ValueType>
                    columns={columns}
                    defaultData={defaultData}
                    dataSource={dataSource}
                    postData={postData}
                    pagination={pagination}
                    bordered={false}
                    loading={loading}
                    rowKey={rowKey}
                    scroll={scroll}
                    params={params}
                    request={request}
                    search={search}
                    polling={polling}
                    toolBarRender={toolBarRender}
                    headerTitle={headerTitle}
                    actionRef={actionRef}
                    dateFormatter={dateFormatter}
                    rowSelection={rowSelection}
                />
            </div>
        </ConfigProvider>
    );
};

export default DataTable;
