import React, { useState } from "react";
import { Breadcrumb, Input, Button, Dropdown, Row, Col, Card, Drawer, Tabs, Progress } from 'antd';
import { SearchOutlined, PlusOutlined, RetweetOutlined, MoreOutlined, ClockCircleFilled, LineChartOutlined, CloseOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const initialData = {
  "CSPMExclusiveDashboard": {
    "widgets": {
      "cloud Accounts": {
        "connected": 2,
        "notConnected": 2
      },
      "cloud Account RiskAssessment": {
        "failed": 1689,
        "warning": 681,
        "notAvailable": 36,
        "passed": 7253
      }
    }
  },
  "CWPPDashboard": {
    "widgets": {
      "top5NamespaceSpecificAlerts": {
      },
      "workloadAlerts": {
      }
    }
  },
  "RegistryScan": {
    "widgets": {
      "imageRiskManagement": {
        "totalImagesScanned": 250,
        "highRisk": 30,
        "mediumRisk": 70,
        "lowRisk": 150
      },
      "imageSecurityIssues": {

      }
    }
  }
};

function App() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("1");
  const [widgetName, setWidgetName] = useState("");
  const [widgetText, setWidgetText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabItems = [
    { key: '1', label: 'CSPM', category: 'CSPMExclusiveDashboard' },
    { key: '2', label: 'CWPP', category: 'CWPPDashboard' },
    { key: '3', label: 'Image', category: 'RegistryScan' },
    { key: '4', label: 'Ticket', category: 'TicketDashboard' },
  ];

  const onClose = () => {
    setOpen(false)
    setWidgetName('');
    setWidgetText('');
    setActiveTab('1');
  };

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    const category = tabItems.find(tab => tab.key === activeTab).category;
    setData(prevData => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        widgets: {
          ...prevData[category].widgets,
          [widgetName]: { description: widgetText }
        }
      }
    }));
    setWidgetName('');
    setWidgetText('');
    setActiveTab('1');
    onClose();
  };

  const handleRemoveWidget = (category, widgetName) => {
    setData(prevData => {
      const updatedWidgets = { ...prevData[category].widgets };
      delete updatedWidgets[widgetName];

      return {
        ...prevData,
        [category]: {
          ...prevData[category],
          widgets: updatedWidgets
        }
      };
    });
  };

  const filteredWidgets = (category) => {
    const widgets = data[category].widgets;
    const searchTermLower = searchTerm.toLowerCase();
    return Object.keys(widgets).filter(widget =>
      widget.toLowerCase().includes(searchTermLower)
    ).map((widget, index) => {
      let content;

      if (category === "CSPMExclusiveDashboard") {
        const pieData = [
          { name: 'Connected', value: widgets[widget].connected },
          { name: 'Not Connected', value: widgets[widget].notConnected },
        ];
        content = (
          <PieChart width={200} height={100}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={50}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#2a3f8b' : '#7c7f8b'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      } else if (category === "CWPPDashboard") {
        content = (
          <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }} >
            <div >
              <LineChartOutlined style={{ fontSize: '26px' }} />
            </div>
            <h3>No graph data is avilable</h3>
          </div>

        );
      } else if (category === "RegistryScan") {
        content = Object.entries(widgets[widget]).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <Progress percent={(value / widgets[widget].totalImagesScanned) * 100} />
          </div>
        ));
      }

      return (
        <Col span={8} style={{ backgroundColor: '#e6f7ff' }} key={index}>
          <Card
            title={widget}
            extra={<CloseOutlined onClick={() => handleRemoveWidget(category, widget)} />}
            style={{
              backgroundColor: '#fff',
              height: '30vh',
              boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'
            }}
          >
            {content}
          </Card>
        </Col>
      );
    });
  };

  return (
    <div style={{ height: '100vh', background: '#EEF7FF' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '10px', background: '#ffff', height: '5vh', padding: '9px', position: 'sticky',
        top: 0,
        zIndex: 1
      }}>
        <Breadcrumb style={{ marginTop: '3px' }}
          items={[
            { title: <a href="" style={{ fontWeight: 'bold' }}>Home</a> },
            { title: <a href="" style={{ color: 'blue', fontWeight: 'bold' }} >Dashboard</a> }
          ]}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder="search anything..."
          style={{ width: '35vw' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={{ width: '5vw' }} />
        <div style={{ width: '5vw' }} />

      </div>
      <div style={{ marginLeft: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px', marginTop: '5px', }}>
          <h3>CNAPP Dashboard</h3>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding: '10px', gap: '5px' }}>
            <Button icon={<PlusOutlined />} onClick={handleAdd}>
              Add Widget
            </Button>
            <Button icon={<RetweetOutlined />} />
            <Button icon={<MoreOutlined />} />
            <Dropdown>
              <Button>
                <ClockCircleFilled style={{ marginRight: 8, color: '#3A1078' }} />
                last 2 days
              </Button>
            </Dropdown>
            <Drawer
              title="Add Widget"
              onClose={onClose}
              open={open}
              headerStyle={{ backgroundColor: '#15157d', color: '#fff' }}
              size="large"
              footer={
                <div style={{ textAlign: 'right' }}>
                  <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirm} type="primary">
                    Confirm
                  </Button>
                </div>
              }
            >
              <h3>Personalise your dashboard by adding the following Widget</h3>
              <Tabs defaultActiveKey="1" onChange={onTabChange}>
                {tabItems.map(tab => (
                  <Tabs.TabPane tab={tab.label} key={tab.key}>
                    <Input
                      placeholder="Enter Widget Name"
                      value={widgetName}
                      onChange={e => setWidgetName(e.target.value)}
                      style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <Input
                      placeholder="Enter Widget Text"
                      value={widgetText}
                      onChange={e => setWidgetText(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Drawer>
          </div>
        </div>
        <div style={{ overflow: 'auto', background: '#e6f7ff' }}>
          <div>
            <h3>CSPMExclusiveDashboard</h3>
            <Row gutter={[8, 8]} style={{ width: '98vw', marginLeft: '10px' }}>
              {filteredWidgets("CSPMExclusiveDashboard")}
              <Col span={8} style={{ backgroundColor: '#e6f7ff' }}>
                <Card
                  style={{
                    backgroundColor: '#fff',
                    height: '30vh',
                    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Button icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Widget
                  </Button>
                </Card>
              </Col>
            </Row>

          </div>
          <div style={{ marginTop: '15px' }}>
            <h3>CWPPDashboard</h3>
            <Row gutter={[8, 8]} style={{ width: '98vw', marginLeft: '10px' }}>
              {filteredWidgets("CWPPDashboard")}
              <Col span={8} style={{ backgroundColor: '#e6f7ff' }}>
                <Card
                  style={{
                    backgroundColor: '#fff',
                    height: '30vh',
                    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Button icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Widget
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: '15px' }}>
            <h3>RegistryScan</h3>
            <Row gutter={[8, 8]} style={{ width: '98vw', marginLeft: '10px' }}>
              {filteredWidgets("RegistryScan")}
              <Col span={8} style={{ backgroundColor: '#e6f7ff' }} >
                <Card
                  style={{
                    backgroundColor: '#fff',
                    height: '30vh',
                    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Button icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Widget
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
