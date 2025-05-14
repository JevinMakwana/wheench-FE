'use client'
import { format, parseISO } from "date-fns";
import { Card, Spin, Typography, Row, Col, Tag, Space, Divider } from "antd";
import useGetApi from "@/hooks/useGetApi";
import usePostApi from "@/hooks/usePostApi";
import { removeHostingTrip, storeUserInfo } from "@/utils/commons";

const { Text } = Typography;

const Profile = () => {
    const {
        isLoading: loading,
        error: userDataError,
        data: userData
    } = useGetApi('user/my-info');

    const { postData } = usePostApi();

    userData && storeUserInfo({user:userData})

    const handleCompleteTrip = async () => {
        removeHostingTrip();
        const res = await postData(`${process.env.NEXT_PUBLIC_COMPLETE_THE_TRIP}`, null, '/profile', false);
    }

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

                        <Row className="mt-3">
                            <button
                                type="submit"
                                onClick={handleCompleteTrip}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {false ? 'Completing the trip...' : 'Complete The Trip'}
                            </button>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
}

export default Profile;
