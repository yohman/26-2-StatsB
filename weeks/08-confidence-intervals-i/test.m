r = normrnd(5, 2, [1000, 1]);
%save('data.mat', 'r');
writematrix(r, 'data_ascii.txt', 'Delimiter', 'space'); 
