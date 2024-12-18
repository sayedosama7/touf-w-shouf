import { useState } from 'react';
import { useAddReviewMutation } from '@/store/Products/AddReviewApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import Rating from '@mui/material/Rating';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const ReviewForm = ({
    code,
    programyear,
    onReviewAdded,
}: {
    code: number;
    programyear: number;
    onReviewAdded: any;
}) => {
    const [review, setReview] = useState('');
    const [rate, setRate] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [addReview, { isLoading, isSuccess, isError }] = useAddReviewMutation();
    const router = useRouter();

    const handleSubmit = async () => {
        const custCode = localStorage.getItem('custcode');
        const name = localStorage.getItem('NAME');
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage(t('You must be logged in to submit a review.'));
            setTimeout(() => {
                router.push('/login');
            }, 2000);
            return;
        }

        if (!custCode || !name) {
            console.error(t('User not logged in or missing information'));
            return;
        }

        if (review.trim() === '' || rate === 0) {
            setErrorMessage(t('Please write a comment and select a rating.'));
            return;
        }

        try {
            const custId = Number(custCode);

            if (isNaN(custId)) {
                console.error('Invalid custCode');
                return;
            }

            const response = await addReview({
                code,
                programyear,
                cust: custId,
                rate,
                review,
            }).unwrap();

            if (response.Review && response.Review.includes(t('already entered a comment'))) {
                setErrorMessage(t('You have already submitted a review for this trip.'));
            } else {
                setReview('');
                setRate(0);
                setErrorMessage(null);
                onReviewAdded();
            }
        } catch (error: any) {
            console.error('Failed to submit review:', error);

            if (error.status === 400 && error.data?.Review) {
                setErrorMessage(error.data.Review.trim());
            } else {
                setErrorMessage(t('Failed to submit review. Please try again.'));
            }
        }
    };

    const { t } = useTranslation();
    return (
        <Box sx={{ my: 3 }}>
            <TextField
                id="outlined-basic"
                placeholder={t('Write your feedback here..')}
                variant="outlined"
                fullWidth
                multiline
                maxRows={5}
                minRows={4}
                value={review}
                onChange={e => setReview(e.target.value)}
            />

            <Box sx={{ my: 2 }}>
                <Typography variant="h6">{t('Rate this program')}</Typography>
                <Rating
                    name="rating"
                    value={rate}
                    onChange={(event, newValue) => setRate(newValue || 0)}
                />
            </Box>

            {isLoading && <Loading />}
            {isSuccess && !errorMessage && (
                <Typography variant="body2" color="success.main">
                    {t('Review submitted successfully!')}
                </Typography>
            )}
            {isError || errorMessage ? (
                <Typography variant="body2" color="error.main">
                    {errorMessage}
                </Typography>
            ) : null}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, color: 'body.main' }}
            >
                <Button variant="contained" size="large" onClick={handleSubmit}>
                    {t('Submit')}
                </Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body1">{t('Share via')}</Typography>
                <IconButton>
                    <FacebookOutlinedIcon sx={{ color: 'body.main' }} />
                </IconButton>
                <IconButton>
                    <TwitterIcon sx={{ color: 'body.main' }} />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default ReviewForm;
