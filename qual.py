def decode(message_file):
    with open(message_file, "r") as file:
        lines = file.readlines()
        sorted_lines = sorted(map(str.split, lines), key=lambda t: int(t[0]))
    
    pyramid = []
    row = x = 1
    while x <= len(sorted_lines):
        pyramid.append(x)
        row += 1
        x += row

    words = []
    for line in sorted_lines:
        index = int(line[0])
        if index in pyramid:
            words.append(line[1])
        
    text = ""
    for x in words:
        text = text + x + " "
    return text

file_path = "coding_qual_input.txt"
decoded_message = decode(file_path)
print(decoded_message)