import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React from 'react';
import Loading from '@/components/Loading/Loading';
import Typography from '@mui/material/Typography';
import { ClientStorage } from '@/hooks/useLocalStroge';
import { useTranslation } from 'react-i18next';
import ReservationItem from './Reservation';
import { useGetUnPaidReservationQuery } from '@/store/Reservation/FetchUnPaidReservation';

interface Reservation {
    CustomerID: number;
    CustomerName: string;
    DateTrip: string;
    GroupCode: number;
    PROG_YEAR: number;
    ProgramCode: number;
    ProgramName: string;
    ReferrancePayment: number;
    ReservationNo: number;
    ReservationReferrance: string;
    TotalPayMent: string;
    Currany: string;
    PayMentStatus: string;
    IMG_Path: string;
}

const UnpaidReservation = () => {
    const { t } = useTranslation();

    const custcode = ClientStorage.get('custcode');

    const { data, isLoading, error } = useGetUnPaidReservationQuery(custcode);
    const reservations = data?.CustomerPayment || [];

    if (isLoading) return <Loading />;
    if (error) return <Typography>{t('Error fetching data')}</Typography>;
    return (
        <div>
            <Container maxWidth="lg">
                <Grid container sx={{ my: 4 }}>
                    <Grid container spacing={2}>
                        {reservations.map((reservation: Reservation) => (
                            <Grid item xs={12} sm={6} key={reservation.ReservationNo}>
                                <ReservationItem
                                    customerName={reservation.CustomerName}
                                    IMG_Path={reservation.IMG_Path}
                                    tripDate={reservation.DateTrip}
                                    reservationNo={reservation.ReservationNo}
                                    totalPayment={reservation.TotalPayMent}
                                    Currany={reservation.Currany}
                                    PROG_YEAR={reservation.PROG_YEAR}
                                    ProgramName={reservation.ProgramName}
                                    PayMentStatus={reservation.PayMentStatus}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default UnpaidReservation;
