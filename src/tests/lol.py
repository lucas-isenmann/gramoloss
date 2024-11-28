def log2(x):
    if x == 1:
        return 0
    else:
        return 1 + log2(x//2)


def gray_code(n):
    gray = []
    for i in range(1,2**n):
        # gray.append(i ^ (i >> 1))
        x = (i ^ (i >> 1)) ^ ((i-1) ^ ((i-1) >> 1))
        gray.append( log2(x))

    return gray


n = 4
gray_sequence = gray_code(n)
print(gray_sequence)

