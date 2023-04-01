const typeOfWalls = {
    wallTop: Array.from(new Set(["1111","0110","0011","0010","1010","1100","1110","1011","0111","0000"])),
    wallSideLeft: Array.from(new Set(["0100"])),
    wallSideRight: Array.from(new Set(["0001"])),
    wallBottom: Array.from(new Set(["1000"])),
    wallInnerCornerDownLeft: Array.from(new Set(["11110001","11100000","11110000","11100001","10100000","01010001","11010001","01100001","11010000","01110001","00010001","10110001","10100001","10010000","00110001","10110000","00100001","10010001"])),
    wallInnerCornerDownRight: Array.from(new Set(["11000111","11000011","10000011","10000111","10000010","01000101","11000101","01000011","10000101","01000111","01000100","11000110","11000010","10000100","01000110","10000110","11000100","01000010"])),
    wallDiagonalCornerDownLeft: Array.from(new Set(["01000000"])),
    wallDiagonalCornerDownRight: Array.from(new Set(["00000001"])),
    wallDiagonalCornerUpLeft: Array.from(new Set(["00010000","01010000"])),
    wallDiagonalCornerUpRight: Array.from(new Set(["00000100","00000101"])),
    wallFull: Array.from(new Set(["1101","0101","1101","1001"])),
    wallFullEightDirections: Array.from(new Set(["11111111","00010100","11100100","10010011","01110100","00010111","00010110","00110100","00010101","01010100","00010010","00100100","00010011","01100100","10010111","11110100","10010110","10110100","11100101","11010011","11110101","11010111","11010111","11110101","01110101","01010111","01100101","01010011","01010010","00100101","00110101","01010110","11010101","11010100","10010101"])),
    wallBottomEightDirections: Array.from(new Set(["01000001"])),
    wallOuterCornerTopLeft: Array.from(new Set(["00010000"]))
}

export default typeOfWalls