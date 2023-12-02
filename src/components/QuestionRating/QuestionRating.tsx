import React, { useState, useEffect } from 'react'
import { FavoriteStarIcon, FavoriteStarFillIcon } from '@fluentui/react-icons-mdl2'

import styles from './QuestionRating.css'

interface QuestionRatingProps {
    maxValue: number
    defaultValue?: number
    setValue: (value: number) => void //| React.Dispatch<React.SetStateAction<number>>
}

enum RatingStarState {
    Filled = 'FILLED',
    Empty = 'EMPTY',
}

interface RatingStar {
    value: number
    state: RatingStarState
}

const QuestionRating: React.FC<QuestionRatingProps> = ({ maxValue, defaultValue = 1, setValue }) => {
    const [ratingStars, setRatingStars] = useState<RatingStar[]>([])
    const [innerValue, setInnerValue] = useState(1)

    useEffect(() => {
        setInnerValue(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        const newRatingStarsState: RatingStar[] = []
        for (let i = 1; i <= maxValue; i++) {
            if (i <= innerValue) {
                newRatingStarsState.push({ value: i, state: RatingStarState.Filled })
            } else {
                newRatingStarsState.push({ value: i, state: RatingStarState.Empty })
            }
        }
        setRatingStars(newRatingStarsState)
    }, [innerValue, maxValue])

    const getRatingStars = () => {
        return ratingStars.map((ratingStar) => {
            const handleStarClick = () => {
                setValue(ratingStar.value)
                setInnerValue(ratingStar.value)
            }
            switch (ratingStar.state) {
                case RatingStarState.Filled:
                    return <FavoriteStarFillIcon onClick={handleStarClick} />
                case RatingStarState.Empty:
                    return <FavoriteStarIcon onClick={handleStarClick} />
            }
        })
    }

    return <div className={styles.container}>{getRatingStars()}</div>
}

export default QuestionRating
