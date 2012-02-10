import time
from mpmath import *

class DigilocSolver:
    def __init__(self):
        self.nbPoints=0
        self.udat=[]
        self.vdat=[]
        self.xdat=[]
        self.ydat=[]
        self.zdat=[]

    def addPoint(self,aVect):
        self.nbPoints +=1
        self.udat.append(aVect[0])
        self.vdat.append(aVect[1])
        self.xdat.append(aVect[2])
        self.ydat.append(aVect[3])
        self.zdat.append(aVect[4])
        
    def prepareArray(self):
        self.Udat=matrix(self.udat)
        self.Vdat=matrix(self.vdat)
        self.Xdat=matrix(self.xdat)
        self.Ydat=matrix(self.ydat)
        self.Zdat=matrix(self.zdat)

    def compute(self,X0,Y0,Z0,A,B,C,Theta):
        RAC = sqrt(A*A + B*B)
        H1 = B / RAC
        H2 = -A / RAC
        H3 = 0.
        f=zeros(self.nbPoints*3,1)
        # vecteur initial
        RAC = sqrt(pow((A*C),2) + pow((B*C),2) + pow((pow(A,2) + pow(B,2)),2))
        G1 = -A*C / RAC
        G2 = -B*C / RAC
        G3 = (pow(A,2) + pow(B,2)) / RAC
        for i in range(0,self.nbPoints):
            U = self.Udat[i]*cos(Theta)+self.Vdat[i]*sin(Theta)
            V =-self.Udat[i]*sin(Theta)+self.Vdat[i]*cos(Theta)
            # vecteur a aligner
            W1 = A + H1*U + G1*V
            W2 = B + H2*U + G2*V
            W3 = C + H3*U + G3*V
            Q1 = self.Xdat[i] - X0
            Q2 = self.Ydat[i] - Y0
            Q3 = self.Zdat[i] - Z0
            #fonctions a annuler
            f[(3*i+1)-1] = W1*Q2 - W2*Q1
            f[(3*i+2)-1] = W2*Q3 - W3*Q2
            f[(3*i+3)-1] = W3*Q1 - W1*Q3 
        return f




if __name__=="__main__":


    print "Testing DigilocSolver..."
    Sol0=(8000., 15000., 1000., 0., -1., 0., 0.)
    P=[]    
    P.append((-0.0480, 0.0290, 9855., 5680., 3825.))
    P.append((-0.0100, 0.0305, 8170., 5020., 4013.))
    P.append(( 0.0490, 0.0285, 2885.,  730., 4107.))
    P.append((-0.0190, 0.0115, 8900., 7530., 3444.))
    P.append(( 0.0600,-0.0005, 5700., 7025., 3008.))
    P.append(( 0.0125,-0.0270, 8980.,11120., 3412.))

    solver=DigilocSolver()
    for i in P:
        solver.addPoint(i)

    solver.prepareArray()
    
   
    begin=time.time()
    res= findroot(solver.compute,Sol0,solver="mnewton",verify=False)

    courseRes=(9664, 13115, 4116, -0.043, -0.169, -0.032, -0.074)
 
    correctRes = solver.compute(*courseRes)
    
    print "Resultat=\n",res
    print "Correct =\n",correctRes
    print "in %s sec"%(time.time()-begin)
    print "ROBUST?"
    
    Sol0 = (0., 0., 0., 0., -1., 0., 0.)
    res = findroot(solver.compute,Sol0,solver="mnewton",verify=False)
    print "Resultat2=\n",res


