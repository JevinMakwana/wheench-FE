'use client'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function RecipeReviewCard() {

    return (
        <>
            <div className='w-[70%] h-[200px]  border border-gray-200 rounded-2xl shadow-sm p-3'>
                <div className="flex">
                    <div className="w-[35%] border border-gray-200 flex-none">
                        RAJKOT
                    </div>
                    <div className="w-[30%] border border-gray-200 flex-1 text-[16px]">
                        <ul>
                            <li>
                                <DirectionsCarIcon />
                                VENUE
                            </li>
                            <li>
                                TIME : 10:15
                            </li>
                        </ul>
                        
                    </div>
                    <div className="w-[35%] border border-gray-200 flex-1">
                        MORBI
                    </div>
                </div>
                <div className="flex">
                    <div className="w-[35%] border border-gray-200 flex-auto">
                        RAJKOT
                    </div>
                    <div className="w-[35%] border border-gray-200 flex-auto">
                        MORBI
                    </div>
                </div>
            </div>
        </>
    );
}
