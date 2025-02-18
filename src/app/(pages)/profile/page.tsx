'use client'
import { format, parseISO } from "date-fns";
import { Card, Spin, Typography, Row, Col, Tag, Space, Divider } from "antd";
import useGetApi from "@/hooks/useGetApi";

const { Text } = Typography;

const Profile = () => {
    const {
        isLoading: loading,
        error: userDataError,
        data: userData
    } = useGetApi('user/my-info');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-4">
            <Card className="shadow-md rounded-md p-4">
                <Row justify="space-between">
                    <Col><Text strong className="text-lg text-[#ffad3b]">My Profile</Text></Col>
                    {/* <Col><Tag color="blue">User</Tag></Col> */}
                </Row>

                <Row gutter={[8, 8]} className="mt-2">
                    <Col span={12}><Text type="secondary">Email:</Text></Col>
                    <Col span={12}><Text>{userData?.email}</Text></Col>

                    <Col span={12}><Text type="secondary">Username:</Text></Col>
                    <Col span={12}><Text>{userData?.username}</Text></Col>

                    <Col span={12}><Text type="secondary">Full Name:</Text></Col>
                    <Col span={12}><Text>{userData?.full_name}</Text></Col>

                    <Col span={12}><Text type="secondary">Phone:</Text></Col>
                    <Col span={12}><Text>{userData?.phone}</Text></Col>
                </Row>

                {userData?.hostingTripId && (
                    <>
                         <Divider />

                        <Row justify="space-between" className="mt-3">
                            <Col><Text strong className="text-lg">Hosting Trip</Text></Col>
                            <Col>
                                <Tag color={userData.hostingTripId.live ? "green" : "red"}>
                                    {userData.hostingTripId.live ? "Live" : "Inactive"}
                                </Tag>
                            </Col>
                        </Row>

                        <Row gutter={[8, 8]} className="mt-2">
                            <Col span={12}><Text type="secondary">Source:</Text></Col>
                            <Col span={12}><Text>{userData.hostingTripId.source}</Text></Col>

                            <Col span={12}><Text type="secondary">Destination:</Text></Col>
                            <Col span={12}><Text>{userData.hostingTripId.destination}</Text></Col>

                            <Col span={12}><Text type="secondary">Car:</Text></Col>
                            <Col span={12}><Text>{userData.hostingTripId.car}</Text></Col>

                            <Col span={12}><Text type="secondary">Seats:</Text></Col>
                            <Col span={12}><Text>{userData.hostingTripId.totalseats}</Text></Col>

                            <Col span={12}><Text type="secondary">Price:</Text></Col>
                            <Col span={12}><Text>₹{userData.hostingTripId.price}</Text></Col>

                            <Col span={12}><Text type="secondary">Takeoff:</Text></Col>
                            <Col span={12}><Text>{format(new Date(parseISO(userData.hostingTripId.takeofftime)), "dd-MM-yyyy")}</Text></Col>
                        </Row>

                        <Divider />

                        <Row className="mt-3">
                            <Col span={24}>
                                <Text strong className="text-sm">Guests:</Text>{" "}
                                {userData?.hostingTripId.guestIds?.length ? (
                                    <Space>
                                        {userData.hostingTripId.guestIds.map((guest: any, index: number) => (
                                            <Tag key={index} color="purple">{guest.username}</Tag>
                                        ))}
                                    </Space>
                                ) : (
                                    <Text type="secondary">No guests yet</Text>
                                )}
                            </Col>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
}

export default Profile;


// 'use client'
// import { useEffect, useState } from "react";
// import { format, parseISO } from "date-fns";
// import axios from "axios";
// import { Card, Spin, Typography, Row, Col, List, Space, Divider } from "antd";

// const { Title, Text } = Typography;

// const Profile = () => {
//     const [userData, setUserData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const TOKEN = localStorage.getItem("authToken");

//     useEffect(() => {
//         const getFreshUser = async () => {
//             try {
//                 const headers = { Authorization: `Bearer ${TOKEN}` };
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/user/my-info`, { headers });

//                 if (response.status === 200) {
//                     setUserData(response.data.user);
//                 } else {
//                     throw new Error("Request failed for fetching user info");
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getFreshUser();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-lg mx-auto mt-6">
//             <Card className="shadow-md rounded-md">
//                 <Title level={4} className="text-center">Profile</Title>
//                 <Divider />

//                 <Row gutter={[16, 8]}>
//                     <Col span={12}><Text strong>Email:</Text></Col>
//                     <Col span={12}><Text>{userData?.email}</Text></Col>

//                     <Col span={12}><Text strong>Username:</Text></Col>
//                     <Col span={12}><Text>{userData?.username}</Text></Col>

//                     <Col span={12}><Text strong>Full Name:</Text></Col>
//                     <Col span={12}><Text>{userData?.full_name}</Text></Col>

//                     <Col span={12}><Text strong>Phone:</Text></Col>
//                     <Col span={12}><Text>{userData?.phone}</Text></Col>
//                 </Row>

//                 {userData?.hostingTripId && (
//                     <>
//                         <Divider />
//                         <Title level={5}>Hosted Trip</Title>

//                         <Row gutter={[16, 8]}>
//                             <Col span={12}><Text strong>Source:</Text></Col>
//                             <Col span={12}><Text>{userData.hostingTripId.source}</Text></Col>

//                             <Col span={12}><Text strong>Destination:</Text></Col>
//                             <Col span={12}><Text>{userData.hostingTripId.destination}</Text></Col>

//                             <Col span={12}><Text strong>Price:</Text></Col>
//                             <Col span={12}><Text>₹{userData.hostingTripId.price}</Text></Col>

//                             <Col span={12}><Text strong>Live:</Text></Col>
//                             <Col span={12}><Text>{userData.hostingTripId.live ? "Yes" : "No"}</Text></Col>

//                             <Col span={12}><Text strong>Car:</Text></Col>
//                             <Col span={12}><Text>{userData.hostingTripId.car}</Text></Col>

//                             <Col span={12}><Text strong>Seats:</Text></Col>
//                             <Col span={12}><Text>{userData.hostingTripId.totalseats}</Text></Col>

//                             <Col span={12}><Text strong>Takeoff:</Text></Col>
//                             <Col span={12}>
//                                 <Text>{format(new Date(parseISO(userData.hostingTripId.takeofftime)), "dd-MM-yyyy")}</Text>
//                             </Col>
//                         </Row>

//                         <Divider />
//                         <Title level={5}>Guests</Title>
//                         {userData?.hostingTripId.guestIds?.length ? (
//                             <List
//                                 size="small"
//                                 dataSource={userData.hostingTripId.guestIds}
//                                 renderItem={(guest: any) => <List.Item>{guest.username}</List.Item>}
//                             />
//                         ) : (
//                             <Text type="secondary">No guests joined yet</Text>
//                         )}
//                     </>
//                 )}
//             </Card>
//         </div>
//     );
// }

// export default Profile;
